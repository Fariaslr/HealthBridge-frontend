
interface InfoItemProps {
  label: string;
  value: string | number;
}

export default function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.label}>{label}:</span>
      <span style={styles.value}>{value}</span>
<<<<<<< HEAD
    
=======
>>>>>>> 6350aebb2cb5c7e657aa1885b82450a3dfcf3c6b
    </div>
  );
}

const styles = {
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px'
  },
  label: {
    color: '#333',
  },
  value: {
    flexGrow: 1,
    marginLeft: '10px',
    color: '#333',
    fontWeight: 'bold'
  },
  editIcon: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '10px',
  },
};
