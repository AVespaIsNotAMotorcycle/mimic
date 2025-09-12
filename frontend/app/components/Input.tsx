import './Input.css';

function Field({
	type,
	inputID,
}) {
  switch (type) {
		default: return <input type={type} id={inputID} />
	}
}

interface InputProps {
	inputID: string,
	label: string,
	type: string,
}

export default function Input(props: InputProps) {
	const { inputID, label, type } = props;
	return (
		<label htmlFor={inputID}>
			<span className="label-text">{label}</span>
			<Field type={type} inputID={inputID} />
		</label>
	);
}
