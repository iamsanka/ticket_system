export default function Footer() {
  return (
    <footer className="w-full border-t mt-10 px-6 py-6 text-sm text-gray-600">
      <div className="max-w-screen-xl mx-auto text-left space-y-1">
        <div>Taprobane Entertainment Oy</div>
        <div>Business ID: 3581857-4</div>
        <div>Helsinki, Finland</div>
        <div>Email: info@taprobane.fi</div>
        <div>Website: www.taprobane.fi</div>
        <div>© {new Date().getFullYear()} SanD. All Rights Reserved.</div>
      </div>
    </footer>
  );
}
