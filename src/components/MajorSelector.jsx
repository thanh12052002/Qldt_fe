function MajorSelector({ majors, selectedMajor, onChange }) {
  console.log("selected major is:" + selectedMajor);
  return (
    <div>
      <label>Ngành:</label>
      <select value={selectedMajor} onChange={(e) => onChange(e.target.value)}>
        <option value="">Chọn ngành</option>
        {majors.map((m) => (
          <option key={m.id} value={m.id}>
            {m.moTa}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MajorSelector;
