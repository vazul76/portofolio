export default function About() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900 transition-all duration-500 py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">Tentang Saya</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Saya membangun produk digital yang rapi, cepat, dan menyenangkan digunakan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl shadow-lg border border-slate-200 dark:border-gray-700 transition-all duration-500 hover:shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">Profil Singkat</h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Saya adalah seorang Full Stack Developer dengan passion dalam menciptakan
              aplikasi web yang modern dan user-friendly. Dengan pengalaman dalam berbagai
              teknologi, saya selalu antusias untuk belajar hal-hal baru.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Saya fokus pada pengembangan aplikasi yang tidak hanya terlihat bagus,
              tetapi juga memberikan pengalaman pengguna yang luar biasa dan performa
              yang optimal.
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-gray-700 rounded-full text-sm font-medium">Clean Code</span>
              <span className="px-4 py-2 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-gray-700 rounded-full text-sm font-medium">UI/UX Focus</span>
              <span className="px-4 py-2 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-gray-700 rounded-full text-sm font-medium">Performance</span>
              <span className="px-4 py-2 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-gray-700 rounded-full text-sm font-medium">Teamwork</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl shadow-lg border border-slate-200 dark:border-gray-700 transition-all duration-500 hover:shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">Yang Saya Kerjakan</h3>
            <ul className="space-y-4 text-gray-700 dark:text-gray-300 text-lg">
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-slate-600 dark:bg-slate-400"></span>
                Membangun UI yang bersih, konsisten, dan mudah dipakai.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-slate-600 dark:bg-slate-400"></span>
                Mengembangkan fitur end-to-end dari frontend hingga backend.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-slate-600 dark:bg-slate-400"></span>
                Optimasi performa, aksesibilitas, dan kualitas kode.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-slate-600 dark:bg-slate-400"></span>
                Kolaborasi dengan tim untuk hasil yang rapi dan terukur.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}