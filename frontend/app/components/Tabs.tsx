import './Tabs.css';

export default function Tabs({
  tabs,
	selected,
	onChange,
}) {
  return (
		<div className="tabs-container">
			{tabs.map(({ id, label }) => (
				<button
					type="button"
					className={[
						'tabs-button',
						selected === id ? 'selected' : 'not-selected',
					].join(' ')}
					onClick={() => { onChange(id); }}
					key={id}
				>
					{label}
				</button>
			))}
		</div>
	);
}
