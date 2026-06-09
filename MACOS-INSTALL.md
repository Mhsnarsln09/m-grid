# macOS Kurulum Notu

`.codex` ve `.agents` klasörleri noktayla başladığı için macOS Finder bunları varsayılan olarak gizler.

## Gizli klasörleri gösterme

Finder açıkken:

```text
Command + Shift + .
```

Aynı kısayol gizli dosyaları yeniden saklar.

## Güvenli kurulum

Paket proje köküne çıkarıldıysa `INSTALL.command` dosyasına çift tıkla.

Terminal üzerinden başka bir proje yoluna kurmak için:

```bash
./INSTALL.command /tam/yol/proje-klasoru
```

Kurulumu kontrol etmek için:

```bash
./VERIFY.command /tam/yol/proje-klasoru
```

Kurulum sonunda şu yollar bulunmalıdır:

```text
.codex/config.toml
.codex/agents/*.toml
.agents/skills/grid-package-analysis/SKILL.md
AGENTS.md
```

Codex proje `.codex/config.toml` katmanını yalnızca proje güvenilir olarak açıldığında yükleyebilir. Dosyalar eklendikten sonra Codex oturumunu yeniden başlat.
