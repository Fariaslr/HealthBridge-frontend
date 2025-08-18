
interface InfoItemProps {
  label: string;
  value: string | number;
}

export default function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.label}>{label}:</span>
      <span style={styles.value}>{value}</span>
    
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
