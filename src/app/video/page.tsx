import { VideoGrid } from "@/components/video/VideoGrid";
import { VideoControls } from "@/components/video/VideoControls";
import { SessionTimer } from "@/components/session/SessionTimer";
import { SessionControls } from "@/components/session/SessionControls";

export default function VideoPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">비디오 상담</h1>
          <SessionTimer />
        </div>

        {/* Video Area */}
        <div className="flex-1 relative">
          <VideoGrid />
        </div>

        {/* Controls */}
        <div className="bg-gray-800 p-4">
          <VideoControls />
          <SessionControls />
        </div>
      </div>
    </div>
  );
}
