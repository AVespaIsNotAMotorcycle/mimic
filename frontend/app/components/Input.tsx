import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

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

function Requirements({ value, requirements }) {
  if (!requirements) return null;
	console.log(requirements[0]);
	return (
		<div className="input-requirements">
		  {requirements.map(([description, checker]) => {
				if (typeof checker !== 'function') {
					console.error(`Checker associated with description "${description}" is not a function.`);
					return null;
				}
				return (
					<div className={checker(value) ? 'yes' : 'no'}>
						{checker(value) ? <CheckIcon /> : <WarningAmberIcon />}
						{description}
					</div>
				);
			})}
		</div>
	);
}

interface InputProps {
	inputID: string,
	label: string,
	type: string,
  value: any,
}

export default function Input(props: InputProps) {
	const {
		inputID,
		label,
		type,
		value = '',
		onChange,
		requirements,
	} = props;
	return (
		<label htmlFor={inputID}>
			<span className="label-text">{label}</span>
			<Field
				type={type}
				inputID={inputID}
				value={value}
				onChange={onChange}
			/>
			<Requirements value={value} requirements={requirements} />
		</label>
	);
}
