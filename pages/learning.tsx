import { useState } from 'react';
import type { NextPage } from 'next';
import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
type Question = {
  id: string;
  questionEn: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
};

type SessionData = {
  sessionId: string;
  content: {
    id: string;
    passage: string;
    audioUrl: string;
  };
  questions: Question[];
};

 const fetchSession = async (userId: string): Promise<SessionData> => {
   // Next.js（3000）ではなく NestJS（3001）を直接叩る
   const res = await axios.post(
     'http://localhost:3001/session/start',
     { userId },
   );
   return res.data;
 };

const submitAnswer = async ({
  sessionId,
  questionId,
  choice,
}: {
  sessionId: string;
  questionId: string;
  choice: number;
}) => {
  const res = await axios.post('/answer', { sessionId, questionId, choice });
  return res.data.correct as boolean;
};

const finishSession = async ({
  sessionId,
  userId,
}: {
  sessionId: string;
  userId: string;
}) => {
  const res = await axios.post(`/session/finish/${sessionId}`, { userId });
  return res.data as { newRating: number; newLevel: number; delta: number };
};

const LearningPage: NextPage = () => {
  const userId = '57c10e82-d9b2-45d3-b0fd-035def6e10fd'; // 実際は認証情報から取得
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // 1) セッション開始
  const {
    data: session,
    isLoading: sessionLoading,
    error:  sessionError,
    } = useQuery({
    queryKey: ['session', userId],
    queryFn:  () => fetchSession(userId),
    enabled:  true,
    });



  // 2) 回答送信
 const answerMutation = useMutation<
  boolean,                            // TData：submitAnswer() の戻り値
  Error,                              // TError
  {                                   // TVariables：submitAnswer() の引数
    sessionId: string;
    questionId: string;
    choice: number;
  }
  >({
  mutationFn: submitAnswer,           // ← ここで関数本体を指定
  onSuccess: (correct) => {           // 成功時コールバック
    if (correct) setCorrectCount(c => c + 1);
    setCurrentIndex(i => i + 1);
  },
  });

  // 3) セッション終了
  const finishMutation = useMutation<
  { newRating: number; newLevel: number; delta: number }, // TData
  Error,                                                   // TError
  { sessionId: string; userId: string }                   // TVariables
>({
  mutationFn: finishSession, // your API call function
  // 必要なら onSuccess / onError もここで書けます
  onSuccess: ({ newRating, newLevel, delta }) => {
    // 例: 画面上の state を更新
    console.log(`Rating updated: ${newRating} (Δ${delta}), Level: ${newLevel}`);
  },
});

  if (sessionLoading) return <p>Loading...</p>;
  if (sessionError) return <p>Error loading session.</p>;
  if (!session) return null;

  // 全問回答後
  if (currentIndex >= session.questions.length) {
  // 初回：まだ mutate を呼んでいない状態
  if (finishMutation.status === 'idle' && !finishMutation.data) {
    finishMutation.mutate({ sessionId: session.sessionId, userId });
    return <p>Submitting your results…</p>;
  }

  // ロード中
  if (finishMutation.status === 'pending') {
    return <p>Calculating your rating…</p>;
  }

  // 成功時
  if (finishMutation.status === 'success' && finishMutation.data) {
    const { newRating, newLevel, delta } = finishMutation.data;
    return (
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2">結果</h2>
        <p>正答率: {(correctCount / session.questions.length) * 100}%</p>
        <p>
          レーティング: {newRating} ({delta >= 0 ? '+' : ''}
          {delta})
        </p>
        <p>新レベル: L{newLevel}</p>
      </div>
    );
  }

  // エラー時
  if (finishMutation.status === 'error') {
    return <p>Error calculating rating. Try again.</p>;
  }
}


  // 現在の問題
  const q = session.questions[currentIndex];

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-2">Passage</h2>
      <p className="mb-4 whitespace-pre-wrap">{session.content.passage}</p>
      <audio controls src={session.content.audioUrl} className="mb-4 w-full" />
      <div className="mb-4">
        <p className="font-medium">
          Q{currentIndex + 1}. {q.questionEn}
        </p>
        {[q.choice1, q.choice2, q.choice3, q.choice4].map((text, idx) => (
          <button
            key={idx}
            onClick={() =>
              answerMutation.mutate({
                sessionId: session.sessionId,
                questionId: q.id,
                choice: idx + 1,
              })
            }
            disabled={answerMutation.isPending}
            className="block w-full text-left px-3 py-2 my-1 border rounded hover:bg-gray-100"
          >
            {text}
          </button>
        ))}
      </div>
      <p>
        {currentIndex + 1} / {session.questions.length}
      </p>
    </div>
  );
};

export default LearningPage;
