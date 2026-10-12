import { useEffect,useState } from 'react';
import { Card,CardHeader,CardTitle,CardDescription,CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Block { ipAddress: string; blockedAt: string | null }

export default function IpBlockManagement() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [ip, setIp] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    const response = await fetch('/api/admin/blocked-ips');
    if (!response.ok) throw new Error('Impossible de charger les IP bloquées.');
    const data = await response.json();
    setBlocks(data.blocks);
  }
  useEffect(() => {
    load().catch(err => setError(err.message)).finally(() => setLoading(false));
    const refresh = () => { void load().catch(err => setError(err.message)); };
    window.addEventListener('ip-blocks-changed', refresh);
    return () => window.removeEventListener('ip-blocks-changed', refresh);
  }, []);

  async function change(method: 'POST' | 'DELETE', address: string) {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/blocked-ips', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ip: address }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Impossible de modifier le blocage.');
      }
      if (method === 'POST') setIp('');
      await load();
      window.dispatchEvent(new Event('ip-blocks-changed'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion.');
    } finally { setBusy(false); }
  }

  return <Card id="ip-block-management">
    <CardHeader>
      <CardTitle>Bloquer une adresse IP</CardTitle>
      <CardDescription>
        Une IP bloquée reçoit un refus d’accès au site et à ses formulaires. Les blocages sont conservés après redémarrage.
        Saisissez une IP complète : les anciennes IP masquées des statistiques ne permettent pas d’identifier un visiteur précis.
        L’accès administrateur reste disponible pour retirer un blocage. Une IP partagée peut correspondre à plusieurs personnes.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <form className="flex flex-col gap-2 sm:flex-row" onSubmit={event => { event.preventDefault(); void change('POST', ip); }}>
        <label className="sr-only" htmlFor="blocked-ip">Adresse IP complète</label>
        <Input id="blocked-ip" value={ip} onChange={event => setIp(event.target.value)} placeholder="Adresse IPv4 ou IPv6 complète" required maxLength={45} autoComplete="off" />
        <Button type="submit" disabled={busy || !ip.trim()}>{busy ? 'En cours…' : 'Bloquer cette IP'}</Button>
      </form>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {loading ? <p>Chargement…</p> : blocks.length ? <ul className="divide-y">
        {blocks.map(block => <li key={block.ipAddress} className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div><span className="break-all font-mono text-sm">{block.ipAddress}</span>
            {block.blockedAt && <p className="text-xs text-muted-foreground">Bloquée le {new Date(block.blockedAt).toLocaleString('fr-FR', { timeZone: 'Europe/Madrid' })}</p>}
          </div>
          <Button type="button" variant="outline" disabled={busy} onClick={() => void change('DELETE', block.ipAddress)}>Débloquer</Button>
        </li>)}
      </ul> : !error && <p className="text-sm text-muted-foreground">Aucune IP bloquée.</p>}
    </CardContent>
  </Card>;
}
