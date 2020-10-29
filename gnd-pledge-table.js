Promise.all([
  import('https://unpkg.io/lit-element?module'),
  import('https://unpkg.io/tabletop'),
]).then(([{ LitElement, html, css }]) => {

  const loadData = async () => {
    const data = await Tabletop.init({
      key: 'https://docs.google.com/spreadsheets/d/1Od41dP2OjFO4aqunNbckFB_fr6-EVa5mH0wVccm_nB8/pubhtml',
      simpleSheet: true,
    })
    return data.map((entry) => ({
      name: entry.Name,
      twitterHandle: entry.Twitter_Handle_Entry,
      twitterLink: entry.Tweet_Link,
      officeLevel: entry.Office_Level,
      officeSought: entry.Office_Sought,
    }))
  }
  
  const downArrow = html`
    <svg class="icon" viewBox="0 0 24 24">
      <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/>
    </svg>
  `
  
  const upArrow = html`
    <svg class="icon" viewBox="0 0 24 24">
      <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
    </svg>
  `
  
  const twitter = html`
    <svg class="icon" viewBox="0 0 24 24">
      <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
    </svg>
  `

  const twitterPrefill = (handle) => {
    return `${handle} Thanks so much for standing with young people and signing the #GreenNewDeal Pledge! Our futures cannot wait — we need all candidates and elected officials to follow your lead and commit to making the GND a Day 1 priority.`
  }
  
  class GndPledgeTable extends LitElement {
    static get properties() {
      return {
        entries: { attribute: false },
        sort: { attribute: false },
        search: { attributes: false },
        background: { type: String },
      }
    }
    
    constructor() {
      super()
      this.entries = []
      this.sort = { type: 'None' }
      this.search = ''
    }
    
    async connectedCallback() {
      super.connectedCallback()
      this.entries = await loadData()
    }
    
    updated() {
      this.style.setProperty('--background', this.background)
    }
    
    handleSortUpdate(property) {
      switch (this.sort.type) {
        case 'None':
          this.sort = { type: 'Asc', property }
          return
        case 'Asc':
          if (this.sort.property === property) this.sort = { type: 'Desc', property }
          else this.sort = { type: 'Asc', property }
          return
        case 'Desc':
          if (this.sort.property === property) this.sort = { type: 'None' }
          else this.sort = { type: 'Asc', property }
          return
        default:
          return
      }
    }
    
    sortedEntries() {
      switch (this.sort.type) {
        case 'None':
          return this.entries
        case 'Asc':
          return [...this.entries].sort((l, r) => {
            return l[this.sort.property].localeCompare(r[this.sort.property])
          })
        case 'Desc':
          return [...this.entries].sort((l, r) => {
            return -l[this.sort.property].localeCompare(r[this.sort.property])
          })
      }
    }
    
    static get styles() {
      return css`
        :host {
          font-family: Source Sans Pro;
          max-width: 960px;
          margin: 0 auto;
          display: block;
          position: relative;
        }
  
        * {
          box-sizing: border-box;
        }
  
        .icon {
          width: 24px;
          height: 24px;
          fill: currentColor;
        }
  
        table {
          width: 100%;
          position: relative;
          border-collapse: collapse;
          background-color: var(--background, #fff);
          border-spacing: 0px 0px;
        }
  
        thead {
          position: relative;
        }
  
        .search-row {
          height: 64px;
        }
        .search-row-cell {
          position: sticky;
          top: var(--offset-top, 0px);
          text-align: right;
          z-index: 2;
          background-color: var(--background, #fff);
          padding-right: 16px;
        }
        .search-row-cell input {
          border-radius: 0;
          height: 48px;
          font-size: 16px;
          color: rgba(34,34,34,0.87);
          font-family: inherit;
          display: inline-block;
          margin: 0;
          padding: 0 16px;
          min-width: 240px;
        }
        .search-row-cover {
          position: absolute;
          width: 1px;
          top: 0;
          bottom: 0;
          right: -1px;
          background-color: var(--background, #fff);
        }
  
        .header-row {
          height: 56px;
        }
        .header-row-cell {
          top: calc(var(--offset-top, 0px) + 63px);
          position: sticky;
          padding: 0px;
          z-index: 2;
        }
        .header-row-cell:first-child {
          border-left: 1px solid rgba(34,34,34,0.12);
        }
        .header-row-cell:last-child {
          border-right: 1px solid rgba(34,34,34,0.12);
        }
        .header-row-cell .label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .header-row-cell button {
          font-family: inherit;
          display: flex;
          justify-content: start;
          align-items: center;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.1px;
          color: rgba(34,34,34,0.6);
          text-align: left;
          padding: 16px;
          outline: 0;
          cursor: pointer;
          width: 100%;
          border: 0;
          border-top: 1px solid rgba(34,34,34,0.12);
          border-bottom: 1px solid rgba(34,34,34,0.12);
          line-height: 24px;
          background-color: var(--background, #fff);
        }
  
        tbody {
          position: relative;
          z-index: 1;
          background-color: rgba(255,255,255,0.6);
        }
        .body-row {
          height: 52px;
        }
        .body-row-cell {
          padding: 0 16px;
          font-size: 14px;
          color: rgba(34,34,34,0.87);
          letter-spacing: 0.25px;
          border-bottom: 1px solid rgba(34,34,34,0.12);
        }
        .body-row-cell:first-child {
          border-left: 1px solid rgba(34,34,34,0.12);
        }
        .body-row-cell:last-child {
          border-right: 1px solid rgba(34,34,34,0.12);
        }
  
        .twitter {
          color: #1c9deb;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1.25px;
          text-decoration: none;
          height: 36px;
          display: inline-grid;
          grid-auto-flow: column;
          grid-column-gap: 8px;
          padding: 0 12px;
          align-items: center;
          border: 1px solid currentColor;
        }
        .twitter .handle {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      `
    }
    
    renderHeader(name, property) {
      return html`
        <th class="header-row-cell">
          <button @click=${() => this.handleSortUpdate(property)}>
            <span class="label">${name}</span>
            ${this.sort.property === property ?
              (this.sort.type === 'Asc' ? downArrow : upArrow) : null}
          </button>
        </th>
      `
    }
    
    render() {
      if (this.entries.length === 0) return null
      
      return html`
        <table>
          <thead>
            <tr class="search-row">
              <th class="search-row-cell" colspan="4">
                <input
                  placeholder="Search"
                  type="text"
                  .value=${this.search}
                  @input=${(e) => this.search = e.target.value}/>
                <div class="search-row-cover"></div>
              </th>
            </tr>
            <tr class="header-row">
              ${this.renderHeader('Candidate Name', 'name')}
              ${this.renderHeader('Office Sought', 'officeSought')}
              ${this.renderHeader('Office Level', 'officeLevel')}
              ${this.renderHeader('Tweet your thanks', 'twitterHandle')}
            </tr>
          </thead>
          <tbody>
            ${this
              .sortedEntries()
              .filter((entry) => {
                return Object.values(entry).some(v => v.toLowerCase().includes(this.search.toLowerCase()))
              })
              .map((entry) => html`
              <tr class="body-row">
                <td class="body-row-cell">${entry.name}</td>
                <td class="body-row-cell">${entry.officeSought}</td>
                <td class="body-row-cell">${entry.officeLevel}</td>
                <td class="body-row-cell">
                  ${entry.twitterHandle.startsWith('@') ?
                    html`
                    <a
                      class="twitter"
                      target="_blank"
                      href="https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterPrefill(entry.twitterHandle))}">
                      ${twitter}
                      <span class="handle">${entry.twitterHandle}</span>
                    </a>` :
                    entry.twitterHandle}
                </td>
              </tr>
            `)}
          </tbody>
        </table>`
    }
  }  

  if (!customElements.get('sunrise-gnd-pledge-table')) {
    customElements.define('sunrise-gnd-pledge-table', GndPledgeTable)
  }
})

