
interface InfoItemProps {
  label: string;
  value: string | number;
  onEdit?: () => void;
}

export default function InfoItem({ label, value, onEdit }: InfoItemProps) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.label}>{label}:</span>
      <span style={styles.value}>{value}</span>
      {onEdit && (
        <button onClick={onEdit} style={styles.editIcon}>
          ✏️
        </button>
      )}
    </div>
  );
}

const styles = {
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0'
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    flexGrow: 1,
    marginLeft: '10px',
    color: '#666',
  },
  editIcon: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '10px',
  },
};
