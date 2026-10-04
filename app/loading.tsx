import { LatticeLoader } from "@/components/lattice_loader";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LatticeLoader
        status="working"
        label="Loading"
        doneLabel="Done in"
        errorLabel="Failed after"
        pattern="spin"
        grid={3}
        shape="round"
        cellSize={8}
        gap={2}
        fontSize={14}
        step={100}
        idleOpacity={0.15}
        glow={true}
        showTimer
      />
    </div>
  );
}
