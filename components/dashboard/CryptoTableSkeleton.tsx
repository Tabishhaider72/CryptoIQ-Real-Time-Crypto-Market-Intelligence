export default function CryptoTableSkeleton() {
  return (
    <div className="mt-8">
      <table className="w-full">
        <tbody>
          {[...Array(8)].map((_, i) => (
            <tr
              key={i}
              className="
              border-b
              border-border/40
              animate-pulse
              "
            >
              <td className="py-6">
                <div className="flex items-center gap-4">
                  <div
                    className="
                    h-11
                    w-11
                    rounded-full
                    bg-muted
                    "
                  />

                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-3 w-16 bg-muted rounded" />
                  </div>
                </div>
              </td>

              <td>
                <div className="h-4 w-24 bg-muted rounded" />
              </td>

              <td>
                <div className="h-4 w-14 bg-muted rounded" />
              </td>

              <td>
                <div className="h-6 w-28 bg-muted rounded" />
              </td>

              <td className="text-right">
                <div className="ml-auto h-4 w-24 bg-muted rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}