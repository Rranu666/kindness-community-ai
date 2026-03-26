export default function TeamPortalFooter() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-900/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Branding */}
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent mb-2">
              KINDNESS COMMUNITY
            </h3>
            <p className="text-slate-400 text-sm">
              Powered by love, driven by kindness
            </p>
          </div>

          {/* Operating Brands */}
          <div>
            <p className="text-slate-400 text-sm">
              <span className="font-semibold text-white">KCF LLC</span>
              <br />
              Operating brands: Kindness Community | Service Connect Pro
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © 2024 Kindness Community. All rights reserved.
          </p>
          <div className="flex gap-6 text-slate-500 text-xs">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}