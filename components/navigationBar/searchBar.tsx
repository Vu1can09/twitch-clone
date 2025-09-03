import { Search } from '../icons';

export default function SearchBar() {
  return (
    <div className='flex items-center h-5 min-w-md'>
      <input
        type='text'
        placeholder='Search'
        className='w-full bg-white border-[1px] p-1 text-sm rounded-l-md border-slate-400'
      />
      <button className='bg-gray-200 text-black p-[0.3rem] rounded-r-md'>
        <Search />
      </button>
    </div>
  );
}