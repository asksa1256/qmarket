export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-400" />
        <p className="text-gray-500 text-sm">데이터 불러오는 중...</p>
      </div>
    </div>
  );
}
