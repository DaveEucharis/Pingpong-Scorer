type Props = { sets: number }

const ListSets = ({ sets }: Props) => {
  const arr = new Array()
  for (let i = 0; i < sets; i++) {
    arr.push(null)
  }

  return (
    <ul className='absolute flex gap-2 bottom-15'>
      {arr.map((v, i) => (
        <li
          key={i}
          className='size-4 rounded-full bg-amber-500 shadow-orange-700'
        ></li>
      ))}
    </ul>
  )
}

export default ListSets
