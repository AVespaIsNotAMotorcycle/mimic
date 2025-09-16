import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import './Input.css';

function Field({
	type,
	inputID,
	value,
	onChange,
	required,
}) {
  switch (type) {
		default:
			return (
				<input
					type={type}
					id={inputID}
					value={value}
					onChange={onChange}
					required={required}
				/>
			);
	}
}

function Requirements({ value, requirements }) {
  if (!requirements) return null;
	return (
		<div className="input-requirements">
		  {requirements.map(([description, checker]) => {
				if (typeof checker !== 'function') {
					console.error(`Checker associated with description "${description}" is not a function.`);
					return null;
				}
				return (
					<div
						className={checker(value) ? 'yes' : 'no'}
						key={description}
					>
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
	required: boolean,
}

export default function Input(props: InputProps) {
	const {
		inputID,
		label,
		type,
		value = '',
		onChange,
		requirements,
		required,
	} = props;
	return (
		<label htmlFor={inputID}>
			<span className="label-text">{label}{required && ' *'}</span>
			<Field
				type={type}
				inputID={inputID}
				value={value}
				onChange={onChange}
				required={required}
			/>
			<Requirements value={value} requirements={requirements} />
		</label>
	);
}
