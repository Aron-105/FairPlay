"use client";

export default function HowToExport() {
  return (
    <section className="bg-neutral-950 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-10 shadow-2xl">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-green-400 mb-3">
              How to Export Your Playlists
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              FairPlay works with playlist exports from Spotify. Here’s the
              quick way to get them:
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            <Step
              number="1"
              title="Open Exportify"
              description={
                <>
                  Go to{" "}
                  <a
                    href="https://exportify.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline"
                  >
                    exportify.net
                  </a>{" "}
                  and log in with your Spotify account.
                </>
              }
            />

            <Step
              number="2"
              title='Click "Export All"'
              description="Download a ZIP file containing CSV exports of all your playlists."
            />

            <Step
              number="3"
              title="Unzip the File"
              description="Extract the downloaded ZIP file to access the individual CSV files."
            />

            <Step
              number="4"
              title="Upload to FairPlay"
              description="Return here and drag the CSV files into the upload box."
            />
          </div>

          <p className="text-neutral-400 text-sm leading-relaxed mt-8">
            That’s it — FairPlay will analyze the audio features included in
            each file and prepare them for balancing.
          </p>

          {/* Helpful Tip */}
          <div className="mt-8 rounded-xl bg-black/30 border border-white/10 p-6 p-t-2 text-sm text-neutral-400">
            <p>
              💡 Tip: You can upload as many playlists as you like. FairPlay
              will automatically analyze and balance them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-6">
      {/* Number Bubble */}
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-green-500/10 border border-green-400 text-green-400 font-semibold">
        {number}
      </div>

      {/* Text */}
      <div>
        <h3 className="font-medium text-white mb-2">{title}</h3>
        <p className="text-neutral-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
