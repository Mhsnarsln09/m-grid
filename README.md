# Önemli: macOS Finder Gizli Klasörler

`.codex` ve `.agents` paket içinde mevcuttur; Finder bunları varsayılan olarak göstermez. `Command + Shift + .` ile görünür hâle getirebilirsin. Çıkarma aracının gizli klasörleri atladığından şüpheleniyorsan `INSTALL.command` dosyasını çalıştır.

# Codex Data Grid Ajan Paketi

Bu klasör, AG Grid benzeri geliştirici odaklı bir tablo/grid paketi için Codex üzerinde çalışacak proje kapsamlı özel ajanları içerir.

## İçerik

- `AGENTS.md`: Repository genelinde kalıcı çalışma ve mimari kuralları
- `.codex/config.toml`: Paralel ajan sınırları
- `.codex/agents/*.toml`: Rol bazlı özel Codex ajanları
- `.agents/skills/grid-package-analysis/SKILL.md`: Tam analizi orkestre eden tekrar kullanılabilir skill
- `prompts/run-full-analysis.md`: Analizi başlatan hazır prompt
- `prompts/implement-mvp.md`: Onaylı bir MVP dilimini uygulama promptu
- `prompts/review-change.md`: Branch/PR inceleme promptu
- `docs/agent-responsibility-matrix.md`: Ajanların görev sınırları
- `docs/analysis-output-template.md`: Nihai analiz şablonu
- `docs/original-analysis-prompt.md`: Ana gereksinim promptu

## Kurulum

Bu klasörün içeriğini repository köküne kopyala. Proje kapsamlı ajan dosyaları `.codex/agents/` altında, skill ise `.agents/skills/` altında kalmalıdır.

Codex'i repository kökünden başlat. Proje `.codex/` ayarlarının yüklenebilmesi için repository'nin güvenilir proje olarak çalıştırılması gerekebilir.

## İlk kullanım

`prompts/run-full-analysis.md` içindeki promptu Codex'e ver.

Skill'i açıkça çağırmak için:

```text
$grid-package-analysis becerisini kullan ve tam mimari analizi çalıştır.
```

Codex subagent'ları yalnızca açıkça istenince oluşturduğu için hazır prompt, ajanları adlarıyla ve dalgalar hâlinde spawn etmesini söyler.

## Önerilen iş akışı

1. Tam analizi çalıştır.
2. `synthesis_reviewer` sonuçlarıyla çelişkileri çöz.
3. Temel ADR'leri onayla.
4. MVP'yi küçük implementation slice'larına böl.
5. Her slice için `implementation_worker` kullan.
6. Değişiklikleri accessibility, security/quality ve ilgili domain ajanlarıyla incelet.
7. Tekrarlanan hataları en yakın `AGENTS.md` dosyasına ekle.

## Ajan izinleri

Analiz ve inceleme ajanları `read-only` çalışır. `implementation_worker`, yalnızca workspace içinde yazabilen `workspace-write` modundadır. Parent oturumun canlı izin ve approval ayarları alt ajanlara yeniden uygulanabilir.

## Model seçimi

Ajan dosyaları belirli bir model adına sabitlenmemiştir. Böylece aktif Codex oturumunun modeli ve reasoning ayarları miras alınır; proje dosyaları güncel model isimlerine bağımlı kalmaz.

## Doğrulama

Codex'te aktif talimatları kontrol etmek için repository kökünde şu tür bir komut kullanılabilir:

```bash
codex --ask-for-approval never "Summarize the current instructions and list the available project custom agents."
```

Analiz ajanlarının dosya değiştirmediğini, implementation ajanının ise yalnızca görev kapsamındaki dosyalara dokunduğunu inceleme aşamasında doğrula.
