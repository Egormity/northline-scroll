"""Checks for the local server's identity and static-file boundary."""

import http.client
import json
from pathlib import Path
import tempfile
import threading
import unittest
from unittest.mock import patch

from launch import check_server
from serve import make_server


class StaticServerTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.directory = Path(self.temporary.name)
        self.root = self.directory / "dist"
        self.root.mkdir()
        (self.root / "index.html").write_text("<h1>Northline</h1>", encoding="utf-8")
        (self.root / "assets").mkdir()
        (self.root / "assets" / "scene.js").write_text("export const scene = true;", encoding="utf-8")
        (self.root / "a room.txt").write_text("A room", encoding="utf-8")
        (self.directory / "private.txt").write_text("Outside the app", encoding="utf-8")
        (self.root / "outside.txt").symlink_to(self.directory / "private.txt")
        self.server = make_server(self.root, 0)
        self.port = self.server.server_port
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.temporary.cleanup()

    def request(self, path, method="GET", headers=None):
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=2)
        try:
            connection.request(method, path, headers=headers or {})
            response = connection.getresponse()
            return response.status, dict(response.getheaders()), response.read()
        finally:
            connection.close()

    def test_health_identity_and_head(self):
        status, headers, data = self.request("/__northline_health__")
        self.assertEqual(status, 200)
        identity = json.loads(data)
        self.assertEqual(identity["appId"], "northline-scroll")
        self.assertEqual(identity["root"], str(self.root))
        self.assertIsInstance(identity["processId"], int)
        self.assertEqual(headers["Cache-Control"], "no-store")
        self.assertEqual(self.request("/__northline_health__", "HEAD")[2], b"")

    def test_static_root_and_assets(self):
        self.assertEqual(self.request("/")[2], b"<h1>Northline</h1>")
        status, headers, data = self.request("/assets/scene.js?v=1")
        self.assertEqual(status, 200)
        self.assertIn("javascript", headers["Content-Type"])
        self.assertEqual(data, b"export const scene = true;")
        self.assertEqual(self.request("/a%20room.txt")[2], b"A room")

    def test_missing_files_and_directories_are_not_listed(self):
        self.assertEqual(self.request("/missing")[0], 404)
        status, _, body = self.request("/assets/")
        self.assertEqual(status, 404)
        self.assertNotIn(b"scene.js", body)

    def test_video_byte_ranges(self):
        sample = bytes(range(256)) * 5
        (self.root / "clip.mp4").write_bytes(sample)
        for value, expected in (("bytes=20-39", sample[20:40]),
                                ("bytes=1250-", sample[1250:]),
                                ("bytes=-10", sample[-10:]),
                                ("bytes=1270-9999", sample[1270:])):
            with self.subTest(value=value):
                status, headers, data = self.request("/clip.mp4", headers={"Range": value})
                self.assertEqual(status, 206)
                self.assertEqual(headers["Accept-Ranges"], "bytes")
                self.assertEqual(int(headers["Content-Length"]), len(expected))
                self.assertTrue(headers["Content-Range"].endswith("/1280"))
                self.assertEqual(data, expected)
        status, headers, data = self.request("/clip.mp4", "HEAD", {"Range": "bytes=0-9"})
        self.assertEqual((status, headers["Content-Length"], data), (206, "10", b""))

    def test_unsatisfiable_ranges_do_not_return_a_full_video(self):
        (self.root / "clip.mp4").write_bytes(b"video")
        for value in ("bytes=5-", "bytes=3-1", "bytes=-0", "bytes=0-1,3-4", "broken"):
            with self.subTest(value=value):
                status, headers, data = self.request("/clip.mp4", headers={"Range": value})
                self.assertEqual(status, 416)
                self.assertEqual(headers["Content-Range"], "bytes */5")
                self.assertEqual(data, b"")

    def test_paths_cannot_leave_the_built_app(self):
        for path in ("/../private.txt", "/%2e%2e/private.txt", "/%2E%2E%2Fprivate.txt",
                     "/assets/../../private.txt", "/..%5Cprivate.txt", "/outside.txt"):
            with self.subTest(path=path):
                status, _, body = self.request(path)
                self.assertEqual(status, 403)
                self.assertNotIn(b"Outside the app", body)

    def test_launcher_reuses_matching_server(self):
        with patch("launch.DEFAULT_ROOT", self.root):
            identity = check_server(f"http://127.0.0.1:{self.port}")
        self.assertEqual(identity["appId"], "northline-scroll")

    def test_launcher_refuses_another_app_location(self):
        with patch("launch.DEFAULT_ROOT", self.directory / "different-build"):
            with self.assertRaisesRegex(RuntimeError, "occupied by another application"):
                check_server(f"http://127.0.0.1:{self.port}")


if __name__ == "__main__":
    unittest.main()
