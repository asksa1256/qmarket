export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-400" />
      </div>
    </div>
  );
}
