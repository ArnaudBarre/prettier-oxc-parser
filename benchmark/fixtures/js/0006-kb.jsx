const React = require('react');

const RecordModel = require('../model/record').getInstance();
const UserModel   = require('../model/user').getInstance();
const Util = require('../util');

const RuleInput         = require('../component/input/rule-input.jsx');
const StageInput        = require('../component/input/stage-input.jsx');
const ResultInput       = require('../component/input/result-input.jsx');
const ResultOptionInput = require('../component/input/result-option-input.jsx');
const RateInput         = require('../component/input/rate-input.jsx');
const KDInput           = require('../component/input/kd-input.jsx');
const SaveBtn           = require('../component/input/save-btn.jsx');

// 本セッションでの増減はいつだってコレが基準
// 最後にこの画面をロードした(= 前回プレイ時)
const lastLastRate = (RecordModel.getLatestRecord() || {}).rate || 0;
// 本セッションでいじった内容を貯めておく(変更すると生える)
let lastSettings = {
  // rule,
  // stageA,
  // stageB,
  // isOptHide,
};

class InputPage extends React.Component {
  constructor() {
    super();

    // 初期表示用
    // 最新の、最後のデータを使う
    const latestRecord = RecordModel.getLatestRecord() || {};
    const { rateRank, rateScore, } = Util.getRankAndScore(latestRecord.rate);

    this.state = {
      rule:       lastSettings.rule   || '1',
      stageA:     lastSettings.stageA || '1',
      stageB:     lastSettings.stageB || '6',
      stage:      'stageA',
      result:     '1',
      missmatch:  false,
      tagmatch:   false,
      rateRank:   ''+rateRank,
      rateScore:  '',
      _rateScore: ''+rateScore, // 実体は↑で、これはplaceholder用
      recentRateGap: Util.getRecentRateGap(latestRecord.rate|0, lastLastRate),
      kill:  '',
      death: '',
      // boolなので
      isOptHide:  'isOptHide' in lastSettings ? lastSettings.isOptHide : true,
    };

    this.toggleOptInput = this.toggleOptInput.bind(this);
    this.onChange       = this.onChange.bind(this);
    this.onSave         = this.onSave.bind(this);
  }

  toggleOptInput(ev) {
    ev.preventDefault();

    const val = !this.state.isOptHide;
    this.setState({
      isOptHide: val
    });
    // このセッション中は設定を維持する
    lastSettings.isOptHide = val;
  }

  onChange(key, val) {
    this.setState({ [key]: val });

    // このセッション中は設定を維持する
    if (key === 'rule' || key === 'stageA' || key === 'stageB') {
      lastSettings[key] = val;
    }
  }

  onSave() {
    const {
      rateRank,
      rateScore,
    } = this.state;
    const rate = (rateRank|0) + (rateScore|0);

    // まるごと渡して向こうで捌く
    RecordModel.setRecord(this.state);
    // 通算バトル数 / ベストウデマエも更新
    UserModel.setRecord(rate);

    if (Util.isMobile()) {
      this.setState({
        rateScore: '', // モバイルでだけ消したい
        kill:      '', // モバイルでだけ消したい
        death:     '', // モバイルでだけ消したい
        _rateScore: rateScore,
        recentRateGap: Util.getRecentRateGap(rate, lastLastRate),
        missmatch: false
      });
    } else {
      this.setState({
        _rateScore: rateScore,
        recentRateGap: Util.getRecentRateGap(rate, lastLastRate),
        missmatch: false
      });
    }
  }

  render() {
    const { route } = this.props;
    const {
      rule,
      stage, stageA, stageB,
      result,
      missmatch, tagmatch,
      rateRank, rateScore, _rateScore,
      recentRateGap,
      isOptHide,
      kill, death,
    } = this.state;
    const isDisconnected = Util.isDisconnected(result);
    const canInput = Util.canInput(rateScore);

    return (
      <div className={`view-${route.path}`}>
        <ul className="input-wrap wrap">

          <li className="input-item">
            <RuleInput
              rule={rule}
              onChange={this.onChange}
            />
          </li>

          <li className="input-item">
            <StageInput
              stage={stage}
              stageAandB={{ stageA, stageB, }}
              onChange={this.onChange}
            />
          </li>

          <li className="input-item">
            <ResultInput
              result={result}
              onChange={this.onChange}
            />
          </li>

          <li className="input-item">
            <RateInput
              rateRank={rateRank}
              rateScore={rateScore}
              _rateScore={_rateScore}
              onChange={this.onChange}
            />
          </li>

          <li className="input-item m-title" onTouchTap={this.toggleOptInput}>
            [{isOptHide ? '+' : '-'}]オプションを{isOptHide ? 'ひらく' : 'とじる'}
          </li>
          <li className="input-item" style={{ display: isOptHide ? 'none' : 'block' }}>
            <ResultOptionInput
              tagmatch={tagmatch}
              missmatch={missmatch}
              isDisconnected={isDisconnected}
              onChange={this.onChange}
            />

            <KDInput
              kill={kill}
              death={death}
              onChange={this.onChange}
            />
          </li>
        </ul>

        <div className="report">
          今回のウデマエ増減: <span className="ft-emp">{recentRateGap.ratePfx}{recentRateGap.rateGap}</span>
        </div>

        <SaveBtn
          canInput={canInput}
          onSave={this.onSave}
        />

        <div className="note">※マッチング事故は、回線落ちで4vs3で負けた時などに目印として使います。</div>
        <div className="note">※今回のウデマエ増減は、ページ再読み込みでリセットされます。</div>
      </div>
    );
  }
}

module.exports = InputPage;
