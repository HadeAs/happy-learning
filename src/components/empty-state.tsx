"use client";

interface EmptyStateProps {
  onGoManage: () => void;
}

export function EmptyState({ onGoManage }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="emoji">📚</div>
      <p>单词库至少需要 4 个单词才能开始游戏哦～</p>
      <button className="btn-manage" onClick={onGoManage}>
        去添加单词
      </button>
    </div>
  );
}
