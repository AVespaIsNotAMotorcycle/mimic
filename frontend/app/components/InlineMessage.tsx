import SuccessIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/WarningAmber';

import './InlineMessage.css';

interface MessageProps {
  type: 'error' | 'success';
  message: string;
}

export default function InlineMessage(props: MessageProps) {
  const { type, message } = props;
  return (
    <div className={['inline-message', type].join(' ')}>
      {type === 'error' && <ErrorIcon />}
      {type === 'success' && <SuccessIcon />}
      {message}
    </div>
  );
}
