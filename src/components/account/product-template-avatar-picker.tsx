"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";

type ProductTemplateAvatarPickerProps = {
  displayName: string;
  initialAvatarUrl: string;
  initials: string;
  inputName?: string;
  editLabel: string;
  formId?: string;
};

export function ProductTemplateAvatarPicker({
  displayName,
  initialAvatarUrl,
  initials,
  inputName = "avatarUrl",
  editLabel,
  formId,
}: ProductTemplateAvatarPickerProps) {
  const [avatarValue, setAvatarValue] = useState(initialAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputId = useId();

  function openPicker() {
    fileInputRef.current?.click();
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) {
        setAvatarValue(result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="xsolt-account-avatar-picker">
      {avatarValue ? (
        <Image
          src={avatarValue}
          alt={displayName}
          width={72}
          height={72}
          unoptimized
          className="xsolt-account-avatar"
        />
      ) : (
        <div className="xsolt-account-avatar xsolt-account-avatar--fallback">{initials}</div>
      )}

      <input type="hidden" name={inputName} value={avatarValue} form={formId} />
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="xsolt-account-avatar-picker__input"
        onChange={onFileChange}
      />
      <button
        type="button"
        className="xsolt-account-avatar-picker__button"
        aria-label={editLabel}
        onClick={openPicker}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M4 20h4l9.8-9.8-4-4L4 16v4Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m12.8 7.2 4 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
