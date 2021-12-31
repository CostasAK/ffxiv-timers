import "./style.css";

import { Component } from "react";
import { FaGithub } from "react-icons/fa";

export class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="footer-credits">
          <div>
            Made by  
            <a href="https://github.com/CostasAK">
              <img
                alt=""
                src="https://avatars.githubusercontent.com/u/23523864?v=4"
              />
               <span>CostasAK</span>
            </a>
          </div>
          <div>
            <a href="https://github.com/CostasAK/ffxiv-timers">
              <FaGithub /> <span>Source</span>
            </a>
          </div>
        </div>
        <div className="footer-legal">
          <div>© SQUARE ENIX CO., LTD. All Rights Reserved.</div>
          <div>
            FINAL FANTASY is a registered trademark of Square Enix Holdings Co.,
            Ltd.
          </div>
          <div>All material used under license.</div>
        </div>
      </footer>
    );
  }
}
