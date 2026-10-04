"use client";

import { USERS, useStore } from "@/lib/store";

// ponytail: static device list until the backend exposes /api/v1/devices
const DEVICES = [
  ["GRIP-01", "ESP32 grip dynamometer", "OPD Room 2", "Calibrated 2026-09-01"],
  ["GRIP-02", "ESP32 grip dynamometer", "Geriatric clinic", "Calibration due"],
];

export default function Admin() {
  const { user, audit } = useStore();
  if (user?.role !== "admin") return <p>Admin access only.</p>;

  return (
    <>
      <h1 className="h1">Admin</h1>

      <section className="card overflow-x-auto">
        <h2 className="h2">Users</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((u) => (
              <tr key={u.email}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="capitalize">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card overflow-x-auto">
        <h2 className="h2">Devices</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {DEVICES.map((d) => (
              <tr key={d[0]}>
                {d.map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card overflow-x-auto">
        <h2 className="h2">Audit log</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>User</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {audit.map((a, i) => (
              <tr key={i}>
                <td>{new Date(a.at).toLocaleString()}</td>
                <td>{a.user}</td>
                <td>{a.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
