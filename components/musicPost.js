import React from "react";

export default function MusicPost({ children, username, description }) {
  const convertLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      const href = url.match(/^https?:/) ? url : `http://${url}`;
      return `<a href="${href}" target="_blank">${url}</a>`;
    });
  };

  const timestamp = new Date().getTime(); // Returns the current Unix timestamp
  // const formatDate = (timestamp) => {
  //   const date = new Date(timestamp);
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return date.toLocaleDateString("en-US", options);
  // };

  const formattedDescription = convertLinks(description);

  return (
    <div className="bg-gray-100 p-8 border-b-2 rounded-lg">
      <div className="flex items-center gap-2">
        <h2 className="text-md text-gray-800">{username}</h2>
      </div>
      <div className="py-4">
        <p
          className="text-sm text-gray-600"
          dangerouslySetInnerHTML={{ __html: formattedDescription }}
        />
      </div>
      {children}
      <div>
        {timestamp && (
          <span className="text-sm text-gray-400">
            {new Date(timestamp).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}
