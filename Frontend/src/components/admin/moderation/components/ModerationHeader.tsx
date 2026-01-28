import React from "react";

interface ModerationHeaderProps {
  title?: string;
  description?: string;
}

export function ModerationHeader({
  title = "Content Moderation",
  description = "Review and approve platform content to maintain quality standards",
}: ModerationHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
