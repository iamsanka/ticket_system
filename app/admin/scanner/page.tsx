import ScannerClient from "./ScannerClient";
import { cookies } from "next/headers";

export default async function ScannerPage() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("admin_session")?.value;

  let role: string | null = null;

  if (cookie) {
    try {
      const parsed = JSON.parse(cookie);
      role = parsed.role;
    } catch {
      role = null;
    }
  }

  return <ScannerClient role={role} />;
}
