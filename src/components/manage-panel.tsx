"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { Word } from "@/types";

interface ManagePanelProps {
  words: Word[];
  onWordsChange: (words: Word[]) => void;
}

const STORAGE_KEY = "wordMatchGame_words";
const MIN_WORDS = 4;

function escapeHtml(s: string): string {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

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

export function ManagePanel({ words, onWordsChange }: ManagePanelProps) {
  const [newWord, setNewWord] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
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

    setAdding(true);
    try {
      let image: string | undefined;

      // Upload new image takes priority
      if (fileRef.current?.files?.length) {
        try {
          image = await readFileAsDataURL(fileRef.current.files[0]);
        } catch (e) {
          alert((e as Error).message);
          return;
        }
      } else {
        image = selectedImage;
      }

      if (!image) {
        alert("请选择已有图片或上传新图片");
        return;
      }

      const formattedWord =
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      const next = [...words, { word: formattedWord, image }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      onWordsChange(next);

      // Clear form
      setNewWord("");
      setSelectedImage("");
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      setAdding(false);
    }
  }, [newWord, selectedImage, words, onWordsChange]);

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

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(words, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "words.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [words]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleAdd();
    },
    [handleAdd],
  );

  return (
    <div className="manage-panel">
      <h3>📝 单词库管理</h3>

      <div className="add-form">
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入英文单词，如 Elephant"
          maxLength={30}
        />
        <select
          value={selectedImage}
          onChange={(e) => setSelectedImage(e.target.value)}
        >
          <option value="">选择已有图片</option>
          {words.map((w) => (
            <option key={w.image} value={w.image}>
              {w.word}
            </option>
          ))}
        </select>
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          id="imageUpload"
          style={{ display: "none" }}
        />
        <label htmlFor="imageUpload" className="btn-upload">
          📷 上传新图片
        </label>
        <button
          className="btn-add"
          onClick={handleAdd}
          disabled={adding}
        >
          + 添加
        </button>
      </div>

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
            <span className="word-text">{w.word}</span>
            <button
              className="btn-delete"
              onClick={() => handleDelete(i)}
            >
              删除
            </button>
          </div>
        ))}
      </div>

      <div className="manage-actions">
        <button className="btn-export" onClick={handleExport}>
          💾 导出单词库 (JSON)
        </button>
      </div>
      <p className="hint">
        💡 添加的单词会自动保存到浏览器本地存储。上传的图片会转为 Base64
        存储，无需服务器。
      </p>
    </div>
  );
}
