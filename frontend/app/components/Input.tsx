import './Input.css';

function Field({
	type,
	inputID,
	value,
	onChange,
}) {
  switch (type) {
		default:
			return <input type={type} id={inputID} value={value} onChange={onChange} />;
	}
}

interface InputProps {
	inputID: string,
	label: string,
	type: string,
  value: any,
}

export default function Input(props: InputProps) {
	const { inputID, label, type, value = '', onChange } = props;
	return (
		<label htmlFor={inputID}>
			<span className="label-text">{label}</span>
			<Field type={type} inputID={inputID} value={value} onChange={onChange} />
		</label>
	);
}
