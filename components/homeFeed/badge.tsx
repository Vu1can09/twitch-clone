export default function Badge({ text }: { text: string }) {
  return (
    <span
      className='text-xs bg-gray-500 text-white py-1 px-2 rounded-full'
      key={text}
    >
      {text}
    </span>
  );
}