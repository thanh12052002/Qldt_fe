function SemesterSelector({ semesters, selectedSemester, onChange }) {
  return (
    <div>
      <label>Kỳ học:</label>
      <select
        value={selectedSemester}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Chọn kỳ học</option>
        {semesters.map((s) => (
          <option key={s.id} value={s.id}>
            {s.ten}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SemesterSelector;
