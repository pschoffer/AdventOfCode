(defproject advent "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.8.0"] [cider/cider-nrepl "0.18.0"] [clojure.java-time "0.3.2"] [clj-time "0.15.0"]]
  :main ^:skip-aot advent.core
  :target-path "target/%s"
  :repl-options {:port 4001}
  :profiles {:uberjar {:aot :all}})
