import { SectorGroup } from '@/types/portfolio';
import { formatINR } from '@/lib/utils';

export default function SectorGroupRow({ group }: { group: SectorGroup }) {
  const isGain = group.totalGainLoss >= 0;

  return (
    <tr className="bg-gray-100 dark:bg-gray-800 font-semibold">
      <td colSpan={4} className="px-4 py-2">
        {group.sector}
      </td>

      <td className="px-4 py-2 text-right">
        {formatINR(group.totalInvestment)}
      </td>

      <td colSpan={2}></td>

      <td className="px-4 py-2 text-right">
        {formatINR(group.totalPresentValue)}
      </td>

      <td
        className={`px-4 py-2 text-right ${
          isGain ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {isGain ? '+' : ''}
        {formatINR(group.totalGainLoss)}
      </td>

      <td colSpan={2}></td>
    </tr>
  );
}