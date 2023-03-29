import React from "react";

export default function DesignPost({
  children,
  username,
  description,
  timestamp,
  type,
}) {
  const convertLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      const href = url.match(/^https?:/) ? url : `http://${url}`;
      return `<a href="${href}" target="_blank" class="${
        url.match(urlRegex) ? "text-bloggypurple" : ""
      }">${url}</a>`;
    });
  };

  const formattedDescription = convertLinks(description);

  return (
    <div className="bg-gray-100 p-8 border-b-2 rounded-lg">
      <div className="flex items-center gap-2">
        <h2 className="text-md text-gray-800">{username}</h2>
      </div>
      <div>
        <h3 className="text-sm text-gray-600">#{type}</h3>
      </div>
      <div className="py-4">
        <p
          className="text-sm text-gray-600"
          dangerouslySetInnerHTML={{ __html: formattedDescription }}
        />
      </div>
      {children}
      <div className="text-sm text-gray-800 py-1">
        {new Date(timestamp?.toDate()).toLocaleString()}
      </div>
    </div>
  );
}
