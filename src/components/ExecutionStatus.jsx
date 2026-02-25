export default function ExecutionStatus({ status, time }) {
  if (status === 'done' && time) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-status-done">
        <div className="w-2 h-2 rounded-full bg-status-done" />
        Done in {time}s
      </div>
    );
  }

  if (status === 'running') {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-status-running">
        <div className="spinner" style={{ width: 10, height: 10 }} />
        Generating...
      </div>
    );
  }

  return null;
}
