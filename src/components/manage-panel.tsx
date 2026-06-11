"use client";
import { useState, useCallback, useRef } from "react";
import type { Word } from "@/types";
import { CloseIcon, UploadIcon, PlusIcon, SettingsIcon } from "./icons";

interface ManagePanelProps {
  words: Word[];
  onWordsChange: (words: Word[]) => void;
  onClose: () => void;
}

const STORAGE_KEY = "wordMatchGame_words";
const MIN_WORDS = 4;

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      return reject(new Error("请选择图片文件"));
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("读取失败"));
    reader.readAsDataURL(file);
  });
}

export function ManagePanel({ words, onWordsChange, onClose }: ManagePanelProps) {
  const [newWord, setNewWord] = useState("");
  const [adding, setAdding] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAdd = useCallback(async () => {
    const word = newWord.trim();
    if (!word) {
      alert("请输入单词");
      return;
    }
    if (words.some((w) => w.word.toLowerCase() === word.toLowerCase())) {
      alert("该单词已存在");
      return;
    }

    if (!fileRef.current?.files?.length) {
      alert("请上传图片");
      return;
    }

    setAdding(true);
    try {
      const image = await readFileAsDataURL(fileRef.current.files[0]);

      const formattedWord =
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      const next = [...words, { word: formattedWord, image }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      onWordsChange(next);

      setNewWord("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setAdding(false);
    }
  }, [newWord, words, onWordsChange]);

  const handleDelete = useCallback(
    (index: number) => {
      if (words.length <= MIN_WORDS) {
        alert(`至少需要保留 ${MIN_WORDS} 个单词才能游戏`);
        return;
      }
      const w = words[index];
      if (!confirm(`确定删除 "${w.word}" 吗？`)) return;

      const next = words.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      onWordsChange(next);
    },
    [words, onWordsChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleAdd();
    },
    [handleAdd],
  );

  return (
    <div className="manage-panel">
      <button className="btn-modal-close" onClick={onClose} aria-label="关闭">
        <CloseIcon size={16} />
      </button>

      <div className="manage-panel-header">
        <h3>
          <SettingsIcon size={20} />
          <span style={{ marginLeft: 6, verticalAlign: "middle" }}>单词库管理</span>
        </h3>

        <div className="add-form">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入英文单词，如 Elephant"
            maxLength={30}
          />
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            id="imageUpload"
            style={{ display: "none" }}
          />
          <label htmlFor="imageUpload" className="btn-upload">
            <UploadIcon size={16} />
            <span style={{ marginLeft: 4 }}>上传图片</span>
          </label>
          <button
            className="btn-add"
            onClick={handleAdd}
            disabled={adding}
          >
            <PlusIcon size={16} /> 添加
          </button>
        </div>
      </div>

      <div className="manage-panel-body">
        <div className="word-list">
          {words.map((w, i) => (
            <div className="word-list-item" key={w.word + i}>
              <img
                className="thumb"
                src={w.image}
                alt={w.word}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="word-text">{w.word.toLowerCase()}</span>
              <button
                className="btn-delete"
                onClick={() => handleDelete(i)}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="manage-panel-footer">
        <p className="hint">
          💡 添加的单词会自动保存到浏览器本地存储。上传的图片会转为 Base64
          存储，无需服务器。
        </p>
      </div>
    </div>
  );
}
