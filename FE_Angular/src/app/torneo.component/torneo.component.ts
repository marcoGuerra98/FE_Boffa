import { Component, OnDestroy, OnInit } from '@angular/core';

type EntityType = 'anagrafiche' | 'giocatori' | 'squadre';

type GenericItem = {
  id?: number | string;
  [key: string]: unknown;
};

type EntityConfig = {
  name: (item: GenericItem) => string;
  fields: string[];
};

declare global {
  interface Window {
    fetchData?: (entity: EntityType) => Promise<void>;
  }
}

const BASE_URL = 'http://localhost:8080';

const FIELD_CONFIG: Record<EntityType, EntityConfig> = {
  anagrafiche: {
    name: (item) =>
      `${String(item['nome'] ?? '')} ${String(item['cognome'] ?? '')}`.trim() ||
      `ID ${String(item.id ?? '')}`,
    fields: ['codice_fiscale', 'email', 'citta', 'telefono', 'data_nascita'],
  },
  giocatori: {
    name: (item) => String(item['nome'] ?? item['cognome'] ?? `ID ${String(item.id ?? '')}`),
    fields: ['ruolo', 'numero_maglia', 'squadra', 'eta'],
  },
  squadre: {
    name: (item) => String(item['nome'] ?? `ID ${String(item.id ?? '')}`),
    fields: ['citta', 'allenatore', 'stadio', 'giocatori'],
  },
};

@Component({
  selector: 'app-torneo.component',
  imports: [],
  templateUrl: './torneo.component.html',
  styleUrl: './torneo.component.css',
})
export class TorneoComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    window.fetchData = (entity: EntityType) => this.fetchData(entity);
  }

  ngOnDestroy(): void {
    delete window.fetchData;
  }

  async fetchData(entity: EntityType): Promise<void> {
    const btnClass = entity === 'anagrafiche' ? 'anagrafica' : entity;
    const btn = document.querySelector<HTMLButtonElement>(`.btn-${btnClass}`);
    const resultsEl = document.getElementById(`results-${entity}`);
    const countEl = document.getElementById(`count-${entity}`);

    if (!btn || !resultsEl || !countEl) {
      return;
    }

    btn.classList.add('loading');
    const btnText = btn.querySelector('span');
    if (btnText) {
      btnText.textContent = 'Caricamento...';
    }

    btn.disabled = true;
    resultsEl.innerHTML = '';

    try {
      const res = await fetch(`${BASE_URL}/${entity}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      const listRaw = Array.isArray(data) ? data : (data.content ?? data.data ?? [data]);
      const list = Array.isArray(listRaw) ? listRaw : [];

      countEl.innerHTML = `<span>${list.length}</span> risultati trovati`;

      if (list.length === 0) {
        resultsEl.innerHTML = [
          '<div class="empty-state">',
          '<div class="empty-icon">📭</div>',
          '<div class="empty-text">Nessun record trovato</div>',
          '</div>',
        ].join('');
        return;
      }

      const config = FIELD_CONFIG[entity];

      list.forEach((rawItem, i) => {
        const item = rawItem as GenericItem;
        const row = document.createElement('div');
        row.className = 'result-row';
        row.style.animationDelay = `${i * 40}ms`;

        const fields = config.fields
          .filter((f) => item[f] !== undefined && item[f] !== null && item[f] !== '')
          .map((f) => `<div class="field-pill"><strong>${f}:</strong> ${String(item[f])}</div>`)
          .join('');

        row.innerHTML = [
          '<div class="result-row-header">',
          `<div class="result-name">${config.name(item)}</div>`,
          `<div class="result-id">#${String(item.id ?? i + 1)}</div>`,
          '</div>',
          fields ? `<div class="result-fields">${fields}</div>` : '',
        ].join('');

        resultsEl.appendChild(row);
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore sconosciuto';
      countEl.innerHTML = '<span style="color:var(--accent3)">Errore</span>';
      resultsEl.innerHTML = `<div class="error-state">⚠️ ${message}</div>`;
    } finally {
      btn.classList.remove('loading');

      if (btnText) {
        btnText.textContent =
          entity === 'anagrafiche'
            ? 'Carica Anagrafiche'
            : entity === 'giocatori'
              ? 'Carica Giocatori'
              : 'Carica Squadre';
      }

      btn.disabled = false;
    }
  }
}
