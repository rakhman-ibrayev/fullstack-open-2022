const Filter = ({ search, handleSearch }) => {
  return (
    <label>
      filter shown with <input value={search} onChange={handleSearch} />
    </label>
  )
}

export default Filter