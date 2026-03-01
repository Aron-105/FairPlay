export default function Instructions1() {
  return (
    <section className="bg-neutral-950 py-10 text-white">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-neutral-400">
            FairPlay blends playlists using audio analysis, not just looking at
            song titles.
          </p>

          <p className="mt-4 text-neutral-400">
            We look at each playlist’s sound profile and select the songs that
            best capture its overall vibe. <br /> Then we balance them evenly
            into one cohesive mix.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-x-8 md:grid-cols-3">
          {/* Step 1 */}
          <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:border-green-400/40 hover:bg-white/10">
            <div className="mb-4 text-sm font-medium text-green-400">
              Step 01
            </div>
            <h3 className="mb-3 text-xl font-semibold">
              Export Your Playlists
            </h3>
            <p className="text-neutral-400">
              Download your playlists as CSV files using Exportify. <br />
              <br /> (takes about a minute)
            </p>
          </div>

          {/* Step 2 */}
          <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:border-green-400/40 hover:bg-white/10">
            <div className="mb-4 text-sm font-medium text-green-400">
              Step 02
            </div>
            <h3 className="mb-3 text-xl font-semibold">
              Choose What to Include
            </h3>
            <p className="text-neutral-400">
              Upload your playlists and select which ones to combine. <br />
              <br /> Control how much large playlists are trimmed to match each
              other.
            </p>
          </div>

          {/* Step 3 */}
          <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:border-green-400/40 hover:bg-white/10">
            <div className="mb-4 text-sm font-medium text-green-400">
              Step 03
            </div>
            <h3 className="mb-3 text-xl font-semibold">
              Create Your Balanced Mix
            </h3>
            <p className="text-neutral-400">
              FairPlay selects the most “on-vibe” songs from each playlist.{" "}
              <br />
              <br /> Then it merges them into one perfectly balanced playlist.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-neutral-400 leading-relaxed mx-auto max-w-xl">
            No data is stored. Your playlists are processed locally and only
            connected to Spotify if you choose to publish the final mix.
          </p>
        </div>
      </div>
    </section>
  );
}
