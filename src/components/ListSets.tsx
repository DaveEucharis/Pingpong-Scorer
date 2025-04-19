type Props = { sets: number }

const ListSets = ({ sets }: Props) => {
  return (
    <ul className='absolute flex gap-2 bottom-15'>
      {new Array(sets).fill(null).map((_, i) => (
        <li
          key={i}
          className='size-4 rounded-full bg-amber-500 shadow-orange-700'
        ></li>
      ))}
    </ul>
  )
}

export default ListSets
