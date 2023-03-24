export default function MusicPost({ children, username, description }) {
  return (
    <div className="bg-gray-100 p-8 border-b-2 rounded-lg">
      <div className="flex items-center gap-2">
        <h2 className="text-md text-gray-800">{username}</h2>
      </div>
      <div className="py-4">
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {children}
    </div>
  );
}
