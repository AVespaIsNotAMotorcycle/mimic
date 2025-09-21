import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import './Input.css';

const Field = ({
  type,
  inputID,
  value,
  onChange,
  required,
}) => {
  switch (type) {
    case 'image':
      return (
        <input
          accept=".jpg,.png,.jpeg"
          id={inputID}
          onChange={onChange}
          required={required}
          type="file"
        />
      );
    case 'textarea':
      return (
        <textarea
          id={inputID}
          onChange={onChange}
          required={required}
          type={type}
          value={value}
        />
      );
    default:
      return (
        <input
          id={inputID}
          onChange={onChange}
          required={required}
          type={type}
          value={value}
        />
      );
  }
};

const Requirements = ({ value, requirements }) => {
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
            key={description}
            className={checker(value) ? 'yes' : 'no'}
          >
            {checker(value) ? <CheckIcon /> : <WarningAmberIcon />}
            {description}
          </div>
        );
      })}
    </div>
  );
};

interface InputProps {
  inputID: string;
  label: string;
  type: string;
  value: any;
  required: boolean;
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
      <span className="label-text">
        {label}
        {required ? ' *' : null}
      </span>
      <Field
        inputID={inputID}
        onChange={onChange}
        required={required}
        type={type}
        value={value}
      />
      <Requirements requirements={requirements} value={value} />
    </label>
  );
}
