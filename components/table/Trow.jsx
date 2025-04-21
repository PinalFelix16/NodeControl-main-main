export default function TRow({ cells }) {
  return (
    <tr>
      {(cells ?? []).map((cell, i) => (
        <td
          key={`${cell}_${i}`}
          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
        >
          {cell}
        </td>
      ))}
    </tr>
  );
}
