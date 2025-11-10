import Image from 'next/image';

export default function HoldingsTable() {
  return (
    <Image
      src="/holdings table.svg"
      alt="Holdings table preview"
      width={1280}
      height={344}
      priority
      style={{ width: '100%', height: 'auto' }}
    />
  );
}
