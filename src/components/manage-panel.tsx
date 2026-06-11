"use client";
import { useState, useCallback, useRef, useEffect } from "react";
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
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.readAsDataURL(file);
  });
}

export function ManagePanel({ words, onWordsChange, onClose }: ManagePanelProps) {
  const [newWord, setNewWord] = useState("");
  const [adding, setAdding] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auto-dismiss toast after 3s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (!f.type.startsWith("image/")) {
        setToast({ type: "error", msg: "请选择图片文件" });
        return;
      }
      setFile(f);
      setToast({ type: "success", msg: `已选取图片：${f.name}` });
    }
  }, []);

  const handleAdd = useCallback(async () => {
    const word = newWord.trim();
    if (!word) {
      setToast({ type: "error", msg: "请输入单词" });
      return;
    }
    if (words.some((w) => w.word.toLowerCase() === word.toLowerCase())) {
      setToast({ type: "error", msg: `"${word}" 已存在` });
      return;
    }
    if (!file) {
      setToast({ type: "error", msg: "请先上传图片" });
      return;
    }

    setAdding(true);
    try {
      const image = await readFileAsDataURL(file);
      const formattedWord =
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      const next = [...words, { word: formattedWord, image }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      onWordsChange(next);

      setNewWord("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setToast({ type: "success", msg: `"${formattedWord}" 添加成功！` });
    } catch (e) {
      setToast({ type: "error", msg: (e as Error).message });
    } finally {
      setAdding(false);
    }
  }, [newWord, file, words, onWordsChange]);

  const handleDelete = useCallback(
    (index: number) => {
      if (words.length <= MIN_WORDS) {
        setToast({ type: "error", msg: `至少需要保留 ${MIN_WORDS} 个单词才能游戏` });
        return;
      }
      const w = words[index];
      if (!confirm(`确定删除 "${w.word}" 吗？`)) return;

      const next = words.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      onWordsChange(next);
      setToast({ type: "success", msg: `已删除 "${w.word}"` });
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

      {/* Toast */}
      {toast ? (
        <div className={`manage-toast${toast.type === "success" ? " success" : " error"}`}>{toast.msg}</div>
      ) : null}

      <div className="manage-panel-header">
        <h3>
          <SettingsIcon size={20} />
          <span style={{ marginLeft: 6, verticalAlign: "middle" }}>单词库管理</span>
          <span className="manage-word-count">（{words.length} 个单词）</span>
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
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor="imageUpload" className="btn-upload">
            <UploadIcon size={16} />
            <span style={{ marginLeft: 4 }}>{file ? "已选图片" : "上传图片"}</span>
          </label>
          {file ? <span className="upload-filename">{file.name}</span> : null}
          <button
            className="btn-add"
            onClick={handleAdd}
            disabled={adding}
          >
            <PlusIcon size={16} /> {adding ? "添加中..." : "添加"}
          </button>
        </div>
      </div>

      <div className="manage-panel-body">
        <div className="word-list">
          {words.length === 0 ? (
            <p className="word-list-empty">暂无单词，请先添加</p>
          ) : (
            words.map((w, i) => (
              <div className="word-list-item" key={w.word + i}>
                <img
                  className="thumb"
                  src={w.image}
                  alt={w.word}
                  loading="lazy"
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
            ))
          )}
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
