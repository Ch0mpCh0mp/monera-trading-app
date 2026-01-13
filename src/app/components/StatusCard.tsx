type StatusCardProps = {
    label: string;
    value: string | number;
}

export default function StatusCard({ label, value }: StatusCardProps) {
    return (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs uppercase tracking-wider text-white/50">{label}</p>
            <p className="text-2xl font-semibold text-white">{value}</p>
        </div>
    );
}